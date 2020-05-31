import os
import json
import pandas as pd
import numpy as np
from glob import glob
from constants import *

def collect_one_feature(vid_data, aggregate="mean"):
    """
    Description: Collects the features over time of one processed video 
    (stored in one json file)
    """
    expressions = vid_data["data"].get("expressions", None)
    
    if expressions is None: # camera couldn't detect a face
        result = pd.DataFrame(-np.ones(len(FEATURES))).transpose()
        result.columns = FEATURES
        result.drop(IGNORED_FEATURES,axis=1, inplace=True)
        result["nb_timestamps"] = 0
        # reorder the columns to have the nb_timestamps first
        columns_reorder = list(result.columns[-1:]) + list(result.columns[:-1])
        result = result[columns_reorder]
        return result
        
    df_features = pd.DataFrame(expressions)
    df_features["time"] = vid_data["timestamps"]
    df_features.set_index("time", inplace=True)
    df_features.drop(IGNORED_FEATURES,axis=1, inplace=True)

    if aggregate is None:
        return df_features
    
    # if we aggregate, also add a column giving the length of the time series before aggregation
    if aggregate == "mean":
        result = pd.DataFrame(df_features.mean(axis=0)).transpose()

    elif aggregate == "max":
        result = pd.DataFrame(df_features.max(axis=0)).transpose() 
   
    else:
        raise ValueError('aggregate parameter can only be "mean" or "max" (passed: {0})'.format(aggregate))
 
    result["nb_timestamps"] = len(df_features)

    # reorder the columns to have the nb_timestamps first
    columns_reorder = list(result.columns[-1:]) + list(result.columns[:-1])
    result = result[columns_reorder]
    return result


def collect_features(video_data, aggregate="mean"):
    """
    Collects all features aggregated over time,
    from each processed videos (stored in one json file) and group them in a dataframe.
    """

    # one df per video
    df_videos = []
    
    # process videos one-by-one
    for i in range(NB_VIDEOS):
        df_videos.append(collect_one_feature(video_data[str(i+1)], aggregate=aggregate))
        
    # concatenated the three df
    
    result = pd.concat(df_videos)
    # add the video_id for each line of the df
    result["video_id"] = np.arange(NB_VIDEOS) + 1
    
    # reorder the columns to have the video_id first
    columns_reorder = list(result.columns[-1:]) + list(result.columns[:-1])
    result = result[columns_reorder]
    
    return result
    
     
def collect_answers(surveys_data, agg_survey):
    """Collect all answers and store them in a dataframe"""
    def get_val(survey_data, name):
        # given the question name and data of a particular survey data, return its answered value
        for pair in survey_data:
            if pair["name"] == name:
                return pair["value"]
    
    # collect answers in a NB_VIDEOS x NB_QUESTIONS + 1 array  (+ 1 to indicat video id)
    answers = np.zeros((NB_VIDEOS, NB_QUESTIONS + 1))
    
    # process videos one-by-one
    for i in range(NB_VIDEOS):
        answers[i][0] = i + 1 # set video id
        for idx,k in enumerate(ANSWERS_DICT.keys()):
            answers[i][idx+1] = get_val(surveys_data[str(i+1)],k)
            
    result = pd.DataFrame(data=answers, columns=["video_id"] + ANSWERS_COLUMNS)
    
    if agg_survey:
        for impression in IMPRESSIONS:
            result[impression] = result[IMPRESSIONS[impression]].mean(axis=1)
        result = result[["video_id"] + list(IMPRESSIONS.keys())]
        
    return result

def extract_data(data, agg_survey=False, agg_features="mean"):
    """Given raw data in a JSON format for one experiment, 
    extract the video data, the answers data and the general data"""
    video_data = data["video"]
    survey_data = data["survey"]
    df_features = collect_features(video_data, agg_features)
    df_answers = collect_answers(survey_data, agg_survey)
    df_general = pd.DataFrame(data["general"],index=[0])
    return df_features, df_answers, df_general


            
    
def store_all_time_series(filenames, agg="sum"):
    """Store for each pair (video_id, featre_name) a datframe
    as returned by collect_time_series"""
    
    for video_id in np.arange(NB_VIDEOS):
        for feature_name in CONSIDERED_FEATURES:
            temp = collect_time_series(filenames, feature_name, str(video_id+1), agg=agg)
            temp.to_csv(DATAFRAMES_PATH + "df_{0}_{1}.csv".format(feature_name,str(video_id+1)))
            
    
def collect_time_series(filenames, feature_name, video_id, agg="sum"):
    """Given a feature_name, and a video_id, collect in a dataframe the 
    time series of this facial features for all users for that particular video.
    The value for each timestamp is aggregated for each second"""
    
    nb_participants = len(filenames)

    time_series_list = []
    # process one file at a time
    for idx, file in enumerate(filenames):
        with open(file) as json_file:
            video_data = json.load(json_file)["video"][video_id]
            
        time_series_list.append((collect_one_feature(video_data, aggregate=None)[feature_name]))
     
    # for each time_serie, change index and resample
    for idx, serie in enumerate(time_series_list):
        #set index to be a timestamp
        serie.index = pd.to_datetime(serie.index.values,unit="s")
        # resample to have one value for each second, 
        if agg == "sum":
            serie = serie.resample(axis="index", rule="s").sum()
        elif agg == "mean":
            serie = serie.resample(axis="index", rule="s").mean()
        else:
            raise ValueError("Aggregator should be either sum or mean")
        serie.index = serie.index.time
        time_series_list[idx] = serie
        
    result = pd.concat(time_series_list, axis=1, sort=False).T
    result["user_id"] = np.arange(nb_participants)
    result["video_id"] = video_id
    result.set_index(["user_id","video_id"], inplace=True)
    return result

def store_all_df(filenames, agg_survey=False, agg_features="mean"):
    """Calls extract_data for each file in filenames, 
    and collect everything in dataframes and store them"""
    
    list_df_features = []
    list_df_answers = []
    list_df_generals = []
    nb_participants = len(filenames)
    
    # process one file at a time
    for idx, file in enumerate(filenames):
        with open(file) as json_file:
            data = json.load(json_file)
            df_features, df_answers, df_general = extract_data(data, agg_survey, agg_features)
            list_df_features.append(df_features)
            list_df_answers.append(df_answers)
            list_df_generals.append(df_general)
    
    # concatenate data for each participant
    df_final_features = pd.concat(list_df_features)
    df_final_answers = pd.concat(list_df_answers)
    df_final_generals = pd.concat(list_df_generals)
    
    # set an id for each user
    user_id = np.arange(nb_participants).repeat(NB_VIDEOS)
    df_final_features["user_id"] = user_id
    df_final_answers["user_id"] = user_id
    df_final_generals["user_id"] = np.arange(nb_participants)
    
    df_final_features.set_index(["user_id","video_id"], inplace=True)
    df_final_answers.set_index(["user_id","video_id"], inplace=True)
    df_final_generals.set_index("user_id", inplace=True)
    
    df_final_features.to_csv(DATAFRAMES_PATH + "df_features_agg_max.csv")
    df_final_answers.to_csv(DATAFRAMES_PATH + "df_answers.csv")
    df_final_generals.to_csv(DATAFRAMES_PATH + "df_generals.csv")


